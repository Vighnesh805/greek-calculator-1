// Black-Scholes formula
function blackScholes(S, K, T, r, sigma, optionType = "call") {
    const d1 = (Math.log(S / K) + (r + 0.5 * Math.pow(sigma, 2)) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    if (optionType === "call") {
        return S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
    } else {
        return K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
    }
}

// Normal cumulative distribution function (CDF)
function normalCDF(x) {
    return (1.0 + Math.erf(x / Math.sqrt(2.0))) / 2.0;
}

// Implied volatility calculation using a numerical method (Bisection Method)
function impliedVolatility(S, K, T, r, marketPrice, optionType = "call") {
    let low = 0.01;
    let high = 3.0;
    const tolerance = 1e-5;

    while (high - low > tolerance) {
        let mid = (low + high) / 2;
        const bsPrice = blackScholes(S, K, T, r, mid, optionType);

        if (bsPrice > marketPrice) {
            high = mid;
        } else {
            low = mid;
        }
    }
    return (low + high) / 2;
}

// Handle calculation button click
document.getElementById('calculateButton').addEventListener('click', function () {
    const S = parseFloat(document.getElementById('stockPrice').value);
    const K = parseFloat(document.getElementById('strikePrice').value);
    const T = parseFloat(document.getElementById('timeToMaturity').value) / 365; // convert days to years
    const r = parseFloat(document.getElementById('riskFreeRate').value);
    const marketPrice = parseFloat(document.getElementById('marketPrice').value);
    const optionType = document.getElementById('optionType').value;

    // Validate inputs
    if (S <= 0 || K <= 0 || T <= 0 || r < 0 || isNaN(S) || isNaN(K) || isNaN(T) || isNaN(r) || isNaN(marketPrice)) {
        document.getElementById('result').textContent = "Please enter valid input values.";
        return;
    }

    const vol = impliedVolatility(S, K, T, r, marketPrice, optionType);
    document.getElementById('result').textContent = `Implied Volatility: ${(vol * 100).toFixed(2)}%`;
});
