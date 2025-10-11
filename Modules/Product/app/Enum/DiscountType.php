<?php

namespace Modules\Product\Enum;

enum DiscountType: string
{
    case PERCENTAGE = 'percentage';
    case FIXED_AMOUNT = 'fixed_amount';
}