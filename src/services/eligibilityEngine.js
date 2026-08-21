// Eligibility Engine: Evaluates user context against service requirements

export function evaluateEligibility(service, userContext = {}) {
  if (!service || !service.eligibility) {
    return {
      status: 'MORE_INFO_REQUIRED',
      badgeColor: 'amber',
      badgeText: 'More Information Required',
      results: []
    };
  }

  let totalCriteria = service.eligibility.length;
  let matchedCount = 0;
  let missingCount = 0;
  let failedCount = 0;

  const results = service.eligibility.map(rule => {
    const { field, label, condition, requiredValue } = rule;
    const userVal = userContext[field];

    let matchStatus = 'PENDING'; // 'MATCH', 'MISMATCH', 'PENDING'
    let userValueText = 'Not Provided';
    let requirementText = '';

    if (condition === 'equals') {
      requirementText = `Must be ${requiredValue}`;
      if (userVal !== undefined && userVal !== null) {
        userValueText = String(userVal);
        if (String(userVal).toLowerCase() === String(requiredValue).toLowerCase()) {
          matchStatus = 'MATCH';
          matchedCount++;
        } else {
          matchStatus = 'MISMATCH';
          failedCount++;
        }
      } else {
        missingCount++;
      }
    } else if (condition === 'max') {
      requirementText = `Max ₹${Number(requiredValue).toLocaleString('en-IN')}/year`;
      if (userVal !== undefined && userVal !== null) {
        const incomeNum = typeof userVal === 'number' ? userVal : parseIncomeString(userVal);
        userValueText = `₹${Number(incomeNum).toLocaleString('en-IN')}`;
        if (incomeNum <= requiredValue) {
          matchStatus = 'MATCH';
          matchedCount++;
        } else {
          matchStatus = 'MISMATCH';
          failedCount++;
        }
      } else {
        missingCount++;
      }
    } else if (condition === 'min') {
      requirementText = `Minimum ${requiredValue} years`;
      if (userVal !== undefined && userVal !== null) {
        userValueText = `${userVal} years`;
        if (Number(userVal) >= Number(requiredValue)) {
          matchStatus = 'MATCH';
          matchedCount++;
        } else {
          matchStatus = 'MISMATCH';
          failedCount++;
        }
      } else {
        missingCount++;
      }
    } else if (condition === 'contains') {
      const allowedArr = Array.isArray(requiredValue) ? requiredValue : [requiredValue];
      requirementText = allowedArr.join(' / ');
      if (userVal !== undefined && userVal !== null) {
        userValueText = String(userVal);
        const matches = allowedArr.some(val => String(userVal).toLowerCase().includes(String(val).toLowerCase()));
        if (matches) {
          matchStatus = 'MATCH';
          matchedCount++;
        } else {
          matchStatus = 'MISMATCH';
          failedCount++;
        }
      } else {
        missingCount++;
      }
    }

    return {
      field,
      label,
      requirementText,
      userValueText,
      matchStatus,
      help: rule.help
    };
  });

  let overallStatus = 'MORE_INFO_REQUIRED';
  if (failedCount > 0) {
    overallStatus = 'LIKELY_NOT_ELIGIBLE';
  } else if (matchedCount === totalCriteria) {
    overallStatus = 'LIKELY_ELIGIBLE';
  } else if (matchedCount > 0) {
    overallStatus = 'LIKELY_ELIGIBLE';
  }

  return {
    status: overallStatus,
    matchedCount,
    totalCriteria,
    missingCount,
    failedCount,
    results
  };
}

function parseIncomeString(incomeStr) {
  if (!incomeStr) return 0;
  const str = String(incomeStr).toLowerCase();
  if (str.includes('2.5')) return 250000;
  if (str.includes('8')) return 450000;
  if (str.includes('above')) return 1000000;
  const numMatch = str.match(/\d+/g);
  if (numMatch) return parseInt(numMatch.join(''), 10);
  return 400000;
}
