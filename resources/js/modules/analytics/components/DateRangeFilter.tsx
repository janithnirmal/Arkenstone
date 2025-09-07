import { addDays, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface DateRangeFilterProps {
    date: DateRange | undefined;
    setDate: (date: DateRange | undefined) => void;
    className?: string;
}

export function DateRangeFilter({ date, setDate, className }: DateRangeFilterProps) {
    const handlePresetChange = (value: string) => {
        const now = new Date();
        if (value === 'custom') {
            // Allow user to pick from calendar
            return;
        }
        const days = parseInt(value, 10);
        setDate({
            from: addDays(now, -days),
            to: now,
        });
    };

    return (
        <div className={cn('grid gap-2', className)}>
            <div className="flex items-center gap-2">
                <Select onValueChange={handlePresetChange} defaultValue="30">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7">Last 7 Days</SelectItem>
                        <SelectItem value="30">Last 30 Days</SelectItem>
                        <SelectItem value="90">Last 90 Days</SelectItem>
                        <SelectItem value="365">Last Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                </Select>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={'outline'}
                            className={cn('w-[300px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                                    </>
                                ) : (
                                    format(date.from, 'LLL dd, y')
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
