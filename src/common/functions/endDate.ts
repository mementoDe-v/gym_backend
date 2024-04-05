
import { addHours, addMonths } from "date-fns";

export const sumTime = {

        sumMonths: (date: Date, months: number): Date => {

            return addMonths( date, months );
        },

        sumHours:  (date: Date, months: number): Date => {

            return addHours( date, months );
        },
}

