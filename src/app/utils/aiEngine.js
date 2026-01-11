/**
 * Simple Linear Regression Logic for Financial Forecasting
 * Predicts balance for the next N days based on historical daily net flow.
 */

export const generateForecast = (transactions, daysToPredict = 30) => {
    if (!transactions || transactions.length < 5) return [];

    // 1. Group transactions by day and calculate daily net
    const dailyFlows = transactions.reduce((acc, tx) => {
        const date = tx.date;
        const amount = tx.type === 'credit' ? Number(tx.amount) : -Number(tx.amount);
        acc[date] = (acc[date] || 0) + amount;
        return acc;
    }, {});

    const dates = Object.keys(dailyFlows).sort();
    const flows = dates.map(d => dailyFlows[d]);

    // 2. Simple Linear Regression: y = mx + b
    const n = flows.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
        sumX += i;
        sumY += flows[i];
        sumXY += i * flows[i];
        sumX2 += i * i;
    }

    const denominator = (n * sumX2 - sumX * sumX);
    if (denominator === 0) return []; // Vertical line / no variation

    const m = (n * sumXY - sumX * sumY) / denominator;
    const b = (sumY - m * sumX) / n;

    // 3. Generate predictions
    let currentBalance = flows.reduce((a, b) => a + b, 0);
    const predictions = [];
    const lastDate = new Date(dates[dates.length - 1]);

    for (let j = 1; j <= daysToPredict; j++) {
        const predictedFlow = m * (n + j) + b;
        currentBalance += predictedFlow;

        const nextDate = new Date(lastDate);
        nextDate.setDate(lastDate.getDate() + j);

        predictions.push({
            date: nextDate.toISOString().split('T')[0],
            amount: Math.round(currentBalance),
            isForecast: true
        });
    }

    return predictions;
};

export const getAnomalyDetections = (transactions) => {
    if (!transactions || transactions.length < 10) return [];

    const amounts = transactions.filter(t => t.type === 'debit').map(t => Number(t.amount));
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const stdDev = Math.sqrt(amounts.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / amounts.length);

    return transactions.filter(t => t.type === 'debit' && Number(t.amount) > avg + (2 * stdDev));
};
