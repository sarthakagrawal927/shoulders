import vscode from '../data/cutaway-vscode.png';
import supabase from '../data/cutaway-supabase.png';
import obs from '../data/cutaway-obs-studio.png';

export const illustrations = {
  vscode: {
    src: vscode,
    alt: 'Conceptual code workshop above three stone bays containing a desktop machine, terminal and file catalogue.',
  },
  supabase: {
    src: supabase,
    alt: 'Conceptual data utility house above three stone bays containing an archive, dispatch counter and generator.',
  },
  'obs-studio': {
    src: obs,
    alt: 'Conceptual broadcast studio above three stone bays containing media machinery, a control console and screens.',
  },
};

export function productIllustration(
  id: string,
): (typeof illustrations)[keyof typeof illustrations] | undefined {
  return illustrations[id as keyof typeof illustrations];
}
