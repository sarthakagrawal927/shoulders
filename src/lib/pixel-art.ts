import runtime from '../data/pixel-runtime.png';
import processor from '../data/pixel-processor.png';
import electricity from '../data/pixel-electricity.png';

const art = {
  node: {
    src: runtime,
    alt: 'Pixel-art runtime workbench: a terminal and a machine processing instruction cards.',
  },
  cpu: {
    src: processor,
    alt: 'Pixel-art processor package with a magnified circuit pattern and a silicon wafer.',
  },
  electricity: {
    src: electricity,
    alt: 'Pixel-art power equipment connected to a server rack. No particular electricity supplier is depicted.',
  },
};
export function foundationIllustration(id: string): (typeof art)[keyof typeof art] | undefined {
  return art[id as keyof typeof art];
}
