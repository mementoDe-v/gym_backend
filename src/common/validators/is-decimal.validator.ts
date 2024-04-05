import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsDecimalConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        return typeof value === 'number' && !isNaN(value) && !!value.toString().match(/^\d+(\.\d{1,2})?$/);
    }

    defaultMessage(args: ValidationArguments) {
        return 'The value must be a decimal number with up to two decimal places.';
    }
}

export function IsDecimal(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsDecimalConstraint,
        });
    };
}
