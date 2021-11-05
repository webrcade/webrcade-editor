export default class EditorValidator {

  errors = []

  updateErrors(tab, prop, valid) {
    let found = false;
    for (let i = 0; i < this.errors.length; i++) {
      const e = this.errors[i];
      if (e.prop === prop && e.tab === tab) {
        found = true;
        if (valid) {
          this.errors.splice(i, 1);
        }
        break;
      }
    }
    if (!valid && !found) {
      this.errors.push({ 
        prop: prop,
        tab: tab
      });
    }

    // console.log("### UPDATE VALIDATION");
    // for (let i = 0; i < this.errors.length; i++) {
    //   const e = this.errors[i];
    //   console.log(e);
    // }
  }

  checkMinLength(tab, prop, str, minLen = 1) {
    const valid = (str !== undefined && (str.trim().length >= minLen));
    this.updateErrors(tab, prop, valid);
    return valid;
  }

  reset() {
    // console.log('## RESET');    
    this.errors = [];
  }

  getMinInvalidTab() {
    let min = -1;
    for (let i = 0; i < this.errors.length; i++) {
      const e = this.errors[i];
      if (min === -1 || e.tab < min ) {
        min = e.tab;
      }
    }   
    return min;
  }

  isTabValid(tab) {
    for (let i = 0; i < this.errors.length; i++) {
      const e = this.errors[i];
      if (e.tab === tab) {
        return false;
      }
    }       
    return true;
  }

  isValid(tab, prop) {
    for (let i = 0; i < this.errors.length; i++) {
      const e = this.errors[i];
      if (e.tab === tab && e.prop === prop) {
        return false;
      }
    }       
    return true;
  }
}