import { AbstractControl } from '@angular/forms';

const disableControls = (controls: AbstractControl[], fromIndex: number) => {
  controls.forEach((ctrl, i) => {
    if (i < fromIndex) {
      ctrl.disable();
    } else {
      ctrl.enable();
    }
  });
};

export default disableControls;
