// import { quizListSchema } from './../state-machine/quiz-list-schema';
import { Component, OnInit, Type } from '@angular/core';
import { Machine, interpret } from 'xstate'

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

@Component({
  selector: 'app-quiz-home',
  templateUrl: './quiz-home.component.html',
  styleUrls: ['./quiz-home.component.scss']
})
export class QuizHomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    setInterval(()=>{
      this.service.send("TIMER")
    }, 3000)
  }

  context = {}
  service  = interpret(lightMachine, {devTools: true}).onTransition(state => {
    console.log(state.value);
    this.context = state.value
  }).start()

}
