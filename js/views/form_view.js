import View from './view.js'

export default class FormView extends View {
  constructor(storageService, viewModel, parentView) {
    super(storageService, viewModel["form"])
    this.entityViewModel = viewModel;
    this.currentItemId = null;

    this.parentView = parentView;
    this.formChanged = false;
  }

  get fields() {
    return this.viewModel.fields
  }

  get formId() {
    return this.viewModel.id;
  }
  get $form() {
    return $("#" + this.formId);
  }
  get form() {
    return this.$form.get(0);
  }
  get formValid() {
    return this.form.checkValidity();
  }
  get $inputs() {
    return $("#" + this.formId + " :input");
  }


  async getViewData() {
    if (this.currentItemId != null) {
      return this.storage.read(this.currentItemId);  
    }
    else {
      return {};
    }
  }


  async bindItemEvents(data) {
    $("#submitButton").click(this.submit);
    $("#cancelButton").click(e => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!this.formChanged || confirm("Are you sure you want to stop editing?")) {
      this.parentView.closeEditModal();
    }
    });

    this.$inputs.change(this.change);
  }


  async bindWrapperEvents() {} 


  submit = ev => {
    ev.preventDefault();
    ev.stopPropagation();

    let valid = this.formValid;
    if(valid) {
      let initialObj = this.getFormData();
      if (this.currentItemId != null) {

        let alteredObj = Object.assign({'id':parseInt(this.currentItemId)}, initialObj);
        
        this.storage.update(this.currentItemId, alteredObj);
        this.parentView.renderItem();
        this.parentView.closeEditModal();

      } else {
        
        let createdObj = Object.assign({'id':parseInt(this.parentView.data.length)}, initialObj);

        this.storage.create(createdObj);
        this.parentView.renderItem();
        this.parentView.closeEditModal();

      }
    } else {
      this.formValidated();
    }
    
  }


  getFormData() {
    return Object.fromEntries(new FormData(this.form));
  }


  change = ev => {

    let $el = this.getEventEl(ev);
    this.fieldValidated($el);
    this.formChanged = true;

  }


  getEventEl(ev) {
    return $(ev.currentTarget);
  }


  fieldValidated($el) { 
    $(this).addClass($el.is(":valid") ? "is_valid" : "is_invalid");
  }


  formValidated() {
    this.$form.addClass("was-validated");
  }

}