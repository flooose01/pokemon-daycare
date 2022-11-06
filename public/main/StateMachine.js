export default class StateMachine {
  constructor(states) {
    this.empty = {
      update: function () {},
      render: function () {},
      enter: function () {},
      exit: function () {},
    };
    this.states = states;
    this.state = this.empty;
  }

  change(state, def) {
    this.state.exit();
    this.state = this.states[state];
    this.state.enter(def);
  }

  update(dt) {
    this.state.update(dt);
  }

  render() {
    this.state.render();
  }
}
