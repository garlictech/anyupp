import { Component } from '@angular/core';

@Component({
  selector: 'bgap-not-found',
  template: `
    <div>
      <img
        src="http://manzardcafe.blog.hu/media/image/2010_Augusztus/404%20error/404%20error%20creative%2008.jpg"
      />
    </div>
  `,
  styles: [
    `
      div {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `,
  ],
})
export class NotFoundComponent {}
