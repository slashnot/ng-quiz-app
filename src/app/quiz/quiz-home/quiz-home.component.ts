// import { quizListSchema } from './../state-machine/quiz-list-schema';
import { Component, OnInit, Type } from '@angular/core';
import { Machine, interpret } from 'xstate'
import { from } from 'rxjs';

const lightMachine = Machine(
  {
    key: 'light',
    initial: 'green',
    context: { elapsed: 0 },
    states: {
      green: {
        on: {
          TIMER: 'yellow',
          POWER_OUTAGE: 'red'
        }
      },
      yellow: {
        on: {
          TIMER: 'red',
          POWER_OUTAGE: 'red'
        }
      },
      red: {
        on: {
          TIMER: 'green',
          POWER_OUTAGE: 'red'
        }
      }
    }
  }
);

const service  = interpret(lightMachine, {devTools: true}).onTransition(state => {
  console.log(state.value);
}).start()

@Component({
  selector: 'app-quiz-home',
  templateUrl: './quiz-home.component.html',
  styleUrls: ['./quiz-home.component.scss']
})
export class QuizHomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    setInterval(()=>{
      service.send("TIMER")
    }, 3000)

    this.state$.subscribe(state=>{
      this.context = state.value
    })
  }
  state$ = from(service);
  context = {}
}
