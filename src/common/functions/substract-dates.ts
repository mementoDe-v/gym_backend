import { differenceInDays, startOfDay, differenceInHours, } from 'date-fns';

export const substractTime = {

  substractDays: (date: Date):boolean => {

    let currentDate = startOfDay(new Date());
    let targetDate = startOfDay(date);
  
  const result: number = differenceInDays(targetDate, currentDate);
  
  
  return result > 0;
    
  },

  substractHours: ( date: Date ): boolean => {

    let currentDate = new Date();
    let targetDate = date;
  
    const result: number = differenceInHours( targetDate, currentDate );
  
    return result > 0;

  }

};