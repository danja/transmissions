
class BaseClass {
    constructor(name) {
        this.name = name;
    }

    baseMethod() {
        console.log('Method of BaseClass');
    }
}

// Utility mixin
function UtilityMixin(Base) {
    return class extends Base {
        utilityMethod() {
            console.log('Utility method');
        }
    };
}

// Applying the mixin to the DerivedClass
class DerivedClass extends UtilityMixin(BaseClass) {
    derivedMethod() {
        console.log('Method of DerivedClass');
    }
}

// Testing the classes
let instance = new DerivedClass('Sample');
instance.baseMethod();    // From BaseClass
instance.utilityMethod(); // From UtilityMixin
instance.derivedMethod(); // From DerivedClass
