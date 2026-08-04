export const certaintyLevels = Object.freeze({
  confirmed: Object.freeze({ label: 'Confirmed', rank: 100, kind: 'canon' }),
  implied: Object.freeze({ label: 'Strongly implied', rank: 80, kind: 'inference' }),
  likely: Object.freeze({ label: 'Likely', rank: 65, kind: 'inference' }),
  possible: Object.freeze({ label: 'Possible', rank: 40, kind: 'theory' }),
  disputed: Object.freeze({ label: 'Disputed', rank: 20, kind: 'dispute' }),
  unknown: Object.freeze({ label: 'Unknown', rank: 0, kind: 'unknown' }),
  retracted: Object.freeze({ label: 'Retracted', rank: -1, kind: 'history' }),
});

export const claimKinds = Object.freeze({
  canon: Object.freeze({ label: 'Canon', description: 'Directly established by the published work or official material.' }),
  inference: Object.freeze({ label: 'Inference', description: 'A conclusion drawn from canonical evidence.' }),
  theory: Object.freeze({ label: 'Theory', description: 'A possible explanation that remains unresolved.' }),
  editorial: Object.freeze({ label: 'Editorial', description: 'Interpretive commentary rather than a factual claim.' }),
  translation: Object.freeze({ label: 'Translation note', description: 'A wording or terminology issue across editions.' }),
});

export const questionStatuses = Object.freeze(['open', 'developing', 'resolved', 'disputed', 'archived']);

export const validateEvidenceClaim = (claim) => {
  if (!claim?.id || !claim?.text) throw new Error('Evidence claims require id and text.');
  if (!certaintyLevels[claim.certainty]) throw new Error(`Unknown certainty: ${claim.certainty}`);
  if (!claimKinds[claim.kind]) throw new Error(`Unknown claim kind: ${claim.kind}`);
  if (claim.kind === 'canon' && !claim.sources?.length) throw new Error(`Canonical claim ${claim.id} requires a source.`);
  return true;
};

export const createOpenQuestion = ({ id, question, openedAtChapter, status = 'open', ...rest }) => {
  if (!id || !question || !Number.isInteger(openedAtChapter)) throw new Error('Open questions require id, question, and openedAtChapter.');
  if (!questionStatuses.includes(status)) throw new Error(`Unknown question status: ${status}`);
  return Object.freeze({ id, question, openedAtChapter, status, evidenceFor: [], evidenceAgainst: [], candidates: [], ...rest });
};
