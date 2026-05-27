import surveyRaw from './survey-ko.md';
import { parseSurvey, type SurveyQuestion } from './survey-parser';

export type { SurveyQuestion };

export const surveyKo: SurveyQuestion[] = parseSurvey(surveyRaw, 'survey-ko.md');
