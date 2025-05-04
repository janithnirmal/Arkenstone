import Button from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { useContext } from 'react';
import { ProductSelectorContext } from '../product-selector';

export default function DefaultQuantitySelector() {
    const { quantity, setQuantity } = useContext(ProductSelectorContext);

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                className="w-max"
                onClick={() => {
                    if (quantity > 1) {
                        setQuantity(quantity - 1);
                    }
                }}
            >
                -
            </Button>
            <Input className="w-20" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
            <Button
                variant="outline"
                className="w-max"
                onClick={() => {
                    setQuantity(quantity + 1);
                }}
            >
                +
            </Button>
        </div>
    );
}
