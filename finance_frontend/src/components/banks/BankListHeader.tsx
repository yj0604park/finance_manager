import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface BankListHeaderProps {
    onAddBank: () => void;
}

const BankListHeader: React.FC<BankListHeaderProps> = ({ onAddBank }) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h1">
                은행 목록
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={onAddBank}
            >
                새 은행 추가
            </Button>
        </Box>
    );
};

export default BankListHeader;
