import { succession340ChapterResearch } from './succession340Research.js';
import { succession341ChapterResearch } from './succession341Research.js';
import { succession342ChapterResearch } from './succession342Research.js';
import { succession343ChapterResearch } from './succession343Research.js';
import { succession344ChapterResearch } from './succession344Research.js';
import { succession345ChapterResearch } from './succession345Research.js';
import { succession346ChapterResearch } from './succession346Research.js';
import { succession347ChapterResearch } from './succession347Research.js';
import { succession348ChapterResearch } from './succession348Research.js';
import { succession349ChapterResearch } from './succession349Research.js';
import { succession350ChapterResearch } from './succession350Research.js';
import { succession351357ChapterResearch } from './succession351357Research.js';
import { succession358ChapterResearch } from './succession358Research.js';
import { succession359ChapterResearch } from './succession359Research.js';
import { succession360ChapterResearch } from './succession360Research.js';
import { succession361ChapterResearch } from './succession361Research.js';
import { succession400ChapterResearch } from './succession400Research.js';
import { succession406ChapterResearch } from './succession406Research.js';
import { succession408ChapterResearch } from './succession408Research.js';
import { succession409ChapterResearch } from './succession409Research.js';
import { succession410ChapterResearch } from './succession410Research.js';
import { succession414415ChapterResearch } from './succession414415Research.js';
import { succession416ChapterResearch } from './succession416Research.js';

export const maintainedSuccessionChapterResearch = Object.freeze([
  ...succession340ChapterResearch,
  ...succession341ChapterResearch,
  ...succession342ChapterResearch,
  ...succession343ChapterResearch,
  ...succession344ChapterResearch,
  ...succession345ChapterResearch,
  ...succession346ChapterResearch,
  ...succession347ChapterResearch,
  ...succession348ChapterResearch,
  ...succession349ChapterResearch,
  ...succession350ChapterResearch,
  ...succession351357ChapterResearch,
  ...succession358ChapterResearch,
  ...succession359ChapterResearch,
  ...succession360ChapterResearch,
  ...succession361ChapterResearch,
  ...succession400ChapterResearch,
  ...succession406ChapterResearch,
  ...succession408ChapterResearch,
  ...succession409ChapterResearch,
  ...succession410ChapterResearch,
  ...succession414415ChapterResearch,
  ...succession416ChapterResearch,
].sort((left, right) => left.number - right.number));

export const maintainedSuccessionChapterNumbers = Object.freeze(
  maintainedSuccessionChapterResearch.map((record) => record.number),
);
