<?php

namespace Modules\Product\App\Enum;

enum DiscountType: string
{
    case PERCENTAGE = 'percentage';
    case FIXED_AMOUNT = 'fixed_amount';
}