import React from 'react';
import { Box, Typography } from '@mui/material';
import { BankWithAccounts } from '../../types/bank';
import BankRow from './BankRow';

interface BankGroupByCountryProps {
    country: string;
    banks: BankWithAccounts[];
    onBankNameClick: (bankId: number) => void;
}

const BankGroupByCountry: React.FC<BankGroupByCountryProps> = ({
    country,
    banks,
    onBankNameClick
}) => {
    return (
        <Box key={country} sx={{ mb: 4 }}>
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                {country || '국가 미지정'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {banks.map((bank) => (
                    <BankRow
                        key={bank.id}
                        bank={bank}
                        onBankNameClick={onBankNameClick}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default BankGroupByCountry;
