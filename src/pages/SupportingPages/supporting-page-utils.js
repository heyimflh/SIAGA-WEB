export function validateCommissionSplit(platformPercent, pilotPercent) {
 return platformPercent + pilotPercent === 100;
}

export function getFAQPanelId(faqId) {
 return `${faqId}-panel`;
}

export function getFAQButtonId(faqId) {
 return `${faqId}-button`;
}
