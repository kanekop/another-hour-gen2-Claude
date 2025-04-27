
const AH_FACTOR = 0.96;
export const toAhMillis = realMs => realMs / AH_FACTOR;
export const fromAhMillis = ahMs => ahMs * AH_FACTOR;
