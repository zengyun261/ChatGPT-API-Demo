import {ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit{
  messages: Message[] = [];
  inputText = '';
  busy = false;

  @ViewChild('messageDiv')
  messageDiv: ElementRef = null!;

  constructor(public cdr: ChangeDetectorRef, public http: HttpClient,  @Inject('BASE_URL') public baseUrl: string) {
  }
  ngOnInit(): void {
    this.messages.push({
      role: "assistant",
      content: '我是 ChatGPT，一个由 OpenAI 训练的大型语言模型。我使用人工智能技术来理解和生成自然语言文本。我可以回答各种各样的问题，提供信息和建议，以及与用户进行对话。',
    });
  }

  async onSubmit() {
    let input = this.inputText.trim();
    if (!input) {
      return;
    }
    this.inputText = '';
    this.busy = true;

    this.messages.push({
      role: 'user',
      content: input,
    });


    // await new Promise(resolve => setTimeout(resolve, 1000));

    let retMsg = <Message> {
      role: 'assistant',
      content: '...',
      loading: true,
    };
    this.messages.push(retMsg);
    let top = this.scrollToEnd();

    try {
      let ret = await firstValueFrom(this.http.post(this.baseUrl + 'chat/send', input, {responseType: "text"}));
      retMsg.markdown = ret.trim();
      // await new Promise(resolve => setTimeout(resolve, 1000))
      if (this.messages.length > 5) {
        this.messages.shift();
      }
      this.scrollTo(top);
    } catch(e) {
      console.warn(e);
      retMsg.content = '出错了...';
    }
    retMsg.loading = false;

    this.scrollToEnd();
    this.busy = false;
  }


  scrollToEnd(): number {
    this.cdr.detectChanges();
    let div = this.messageDiv.nativeElement as HTMLDivElement;
    div.scrollTo({top: div.scrollHeight});
    return div.scrollTop;
  }
  scrollTo(top: number) {
    console.log(top)
    this.cdr.detectChanges();
    let div = this.messageDiv.nativeElement as HTMLDivElement;
    setTimeout(()=>{
      div.scrollTop = top + 50;
    }, 0);
  }
}

interface Message {
  role: 'user' | 'assistant',
  content: string,
  loading?: boolean,
  markdown?:string;
}
