import { SpecReporter } from 'jasmine-spec-reporter';

jasmine.getEnv().clearReporters(); // Clear default console reporter
jasmine.getEnv().addReporter(new SpecReporter({
    spec: {
        displayPending: true // Display pending (not fully implemented) specs
    }
}));