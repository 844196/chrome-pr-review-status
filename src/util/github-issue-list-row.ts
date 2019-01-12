import { $ } from './query-selector';

type Width = 'col-1' | 'col-2' | 'col-3' | 'col-4' | 'col-4' | 'col-5' | 'col-6' | 'col-7' | 'col-7' | 'col-8';
const widthMap: { [_ in Width]: string } = {
  'col-1': 'col-8',
  'col-2': 'col-7',
  'col-3': 'col-6',
  'col-4': 'col-5',
  'col-5': 'col-4',
  'col-6': 'col-3',
  'col-7': 'col-2',
  'col-8': 'col-1',
};

export class GithubIssueListRow {
  public constructor(public readonly dom: HTMLDivElement) {}

  public parsePullRequestPageUrl() {
    return $<HTMLAnchorElement>(this.dom, 'a.h4')!.href;
  }

  public insertAfterTitleColumn(ele: Element, width: Width) {
    const titleColumn = $(this.dom, '.col-9')!;
    titleColumn.classList.replace('col-9', widthMap[width]);
    ele.classList.add(width);
    titleColumn.parentNode!.insertBefore(ele, titleColumn.nextSibling);
  }

  public changeBackgroundColor(color: string) {
    this.dom.style.backgroundColor = color;
  }
}
