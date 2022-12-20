import { State, NgxsOnInit, StateContext, Action } from '@ngxs/store';

export class PopulateForm {
  static readonly type = '[App] Populate Form';
}

export interface AppStateModel {
  form: any;
}

const defaults = {
  form: {
    model: {
      list: []
    },
    dirty: false,
    status: '',
    errors: {}
  }
}

@State({
  name: 'app',
  defaults: defaults
})
export class AppState implements NgxsOnInit {

  ngxsOnInit({dispatch}: StateContext<AppStateModel>) {
    dispatch(PopulateForm);
  }

  /**
   * In a real app, I will probably want to add the data async.
   */
  @Action(PopulateForm)
  populateForm({getState, patchState}: StateContext<AppStateModel>) {
    const form = getState().form;

    setTimeout(() => {
      form.model.list = ['A', 'B', 'C'];

      patchState({ form });
    }, 1000)
  }

}
