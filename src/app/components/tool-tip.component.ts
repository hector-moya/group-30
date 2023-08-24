import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'tool-tip',
    standalone: true,
    imports: [CommonModule],
    template: `
        <svg class="icon cursor-pointer txt-muted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"> <path id="help" d="M5004,1998a10,10,0,1,1,10,10A9.994,9.994,0,0,1,5004,1998Zm1.4,0a8.6,8.6,0,1,0,8.6-8.6A8.614,8.614,0,0,0,5005.4,1998Zm7.308,3.667a1.012,1.012,0,0,1,1-1.014,1.014,1.014,0,0,1,0,2.027A1.011,1.011,0,0,1,5012.7,2001.667Zm.264-2.8a2.408,2.408,0,0,1,.881-2c.435-.369,1.171-.777,1.171-1.488,0-.605-.525-.9-1.184-.9-1.343,0-1.054,1.014-1.764,1.014a.756.756,0,0,1-.791-.75c0-.711.817-1.764,2.594-1.764,1.685,0,2.8.934,2.8,2.172a3.371,3.371,0,0,1-1.474,2.408,1.652,1.652,0,0,0-.738,1.646c0,.25-.132.54-.776.54C5013.152,1999.745,5012.968,1999.548,5012.968,1998.864Z" transform="translate(-5004 -1988)" /> </svg>
    `
})
export class ToolTipComponent {

}
