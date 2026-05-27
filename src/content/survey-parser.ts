export type SurveyQuestion =
  | { id: number; area: string; question: string; type: 'multi'; options: string[] }
  | { id: number; area: string; question: string; type: 'single'; options: string[]; allowFree?: boolean }
  | { id: number; area: string; question: string; type: 'free'; required?: boolean }
  | { id: number; area: string; question: string; type: 'scale5' };

// Sources of truth are `./survey-ko.md` and `./survey-en.md`. This parser
// builds the runtime arrays from the markdown. Format is documented at the
// top of the .md files.
export function parseSurvey(md: string, sourceLabel: string): SurveyQuestion[] {
  const blocks = md.split(/\n(?=##\s+Q\d)/);
  const questions: SurveyQuestion[] = [];

  for (const block of blocks) {
    const header = /^##\s+Q(\d+)\s*$/m.exec(block);
    if (!header || header[1] === undefined) continue;
    const id = Number(header[1]);

    const meta: Record<string, string> = {};
    const options: string[] = [];
    let inOptions = false;

    for (const line of block.split('\n')) {
      if (line.startsWith('## ')) continue;

      if (inOptions && /^\s{2,}-\s+/.test(line)) {
        options.push(line.replace(/^\s{2,}-\s+/, '').trim());
        continue;
      }

      const kv = /^-\s+([A-Za-z]+)\s*:\s*(.*)$/.exec(line);
      if (kv && kv[1] !== undefined) {
        const key = kv[1];
        const value = (kv[2] ?? '').trim();
        if (key === 'options') {
          inOptions = true;
        } else {
          inOptions = false;
          meta[key] = value;
        }
      }
    }

    const area = meta.area ?? '';
    const question = meta.question ?? '';
    const type = meta.type;

    if (type === 'multi') {
      questions.push({ id, area, question, type: 'multi', options });
    } else if (type === 'single') {
      questions.push({
        id,
        area,
        question,
        type: 'single',
        options,
        ...(meta.allowFree === 'true' ? { allowFree: true } : {}),
      });
    } else if (type === 'free') {
      questions.push({
        id,
        area,
        question,
        type: 'free',
        ...(meta.required === 'true' ? { required: true } : {}),
      });
    } else if (type === 'scale5') {
      questions.push({ id, area, question, type: 'scale5' });
    } else {
      throw new Error(`${sourceLabel}: Q${id} has unknown type "${String(type)}"`);
    }
  }

  questions.sort((a, b) => a.id - b.id);
  return questions;
}
