import surveyRaw from './survey-en.md';
import { parseSurvey, type SurveyQuestion } from './survey-parser';

export const surveyEn: SurveyQuestion[] = parseSurvey(surveyRaw, 'survey-en.md');
