import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Select } from '@ngxs/store';
import { AppStateModel } from './app.state';
import { Observable, Subscription, pipe } from 'rxjs';
import { first, tap } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit, OnDestroy  {

  /**
   * Select the app state.
   */
  @Select(state => state.app)
  app$: Observable<AppStateModel>;

  /**
   * Initializing the form
   */
  form: FormGroup;

  /**
   * A subscription of the form data
   */
  subscription: Subscription;

  /**
   * For the sake of the tslint
   */
  get list() {
    return (this.form.get('list') as FormArray).controls;
  }

  constructor(private fb: FormBuilder) {}

  /**
   * When the app state is initialized, then initialize the form.
   * PS - I added `first` and not `filter` because on this case, I don't want
   * the form to be updated while the user enters his data.
   */
  ngOnInit() {
    this.subscription = this.app$.pipe(first(app => app.form.model.list.length))
      .subscribe(appState => this.initForm(appState))
  }

  /**
   * Unsubscribe from the form data
   */
  ngOnDestroy() {
    return this.subscription && this.subscription.unsubscribe();
  }

  /**
   * Initializing the form according to the app state.
   */
  private initForm(appState: AppStateModel) {
    const items = appState.form.model.list.map(item => this.createItemControl());

    this.form = this.fb.group({
      list: this.fb.array(items)
    });
  }

  /**
   * Adds a new item to the list
   */
  addItem() {
    (this.form.get('list') as FormArray).push(this.createItemControl())
  }

  /**
   * Creates a new item control
   */
  private createItemControl() {
    return this.fb.control(null);
  }
}
