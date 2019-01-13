import { AbstractComponent } from './abstract-component';

export class ReviewStatusIcon extends AbstractComponent<HTMLSpanElement> {
  public readonly dom: HTMLSpanElement;

  public constructor(svg: string) {
    super();

    const dom = document.createElement('span');
    dom.style.display = 'inline-block';
    dom.style.textAlign = 'center';
    dom.style.verticalAlign = 'middle';
    dom.innerHTML = svg;

    this.dom = dom;

    this.setWidth('20px').setHeight('20px');
  }
}

/**
 * Octicons - https://github.com/primer/octicons
 *
 * MIT License
 *
 * Copyright (c) 2019 GitHub Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const commentSvg = `<svg class="octicon octicon-comment" viewBox="0 0 16 16" version="1.1" width="16" height="16"><path fill-rule="evenodd" d="M14 1H2c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h2v3.5L7.5 11H14c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zm0 9H7l-2 2v-2H2V2h12v8z"></path></svg>`;
const xSvg = `<svg class="octicon octicon-x" viewBox="0 0 12 16" version="1.1" width="12" height="16"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>`;
const checkSvg = `<svg class="octicon octicon-check" viewBox="0 0 12 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>`;
const primitiveDotSvg = `<svg class="octicon octicon-primitive-dot" viewBox="0 0 8 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 8c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z"></path></svg>`;

export const icons = {
  leftComments: () => new ReviewStatusIcon(commentSvg).addClass('text-gray'),
  requestedChanges: () => new ReviewStatusIcon(xSvg).addClass('text-red'),
  approved: () => new ReviewStatusIcon(checkSvg).addClass('text-green'),
  unreviewed: () => new ReviewStatusIcon(primitiveDotSvg).addClass('bg-pending'),
};
