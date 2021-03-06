export const TextExpression: RegExp = new RegExp("^[a-zA-Z]+$");
export const VariableExpression: RegExp = new RegExp("^[a-z]$");
export const FunctionExpression: RegExp = new RegExp("^(~|)([a-zA-Z0-9]+)(|(\\[[a-z]\\])|(\\[[a-z]\\,[a-z]\\]))$");
export const SentenceExpression: RegExp = new RegExp("^([a-zA-Z0-9]+)(|(\\[([a-zA-Z]+)\\])|(\\[([a-zA-Z]+)\\,([a-zA-Z]+)\\]))$");