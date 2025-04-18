import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

import { BankWithAccounts } from '../../types/bank';

interface BankRowProps {
  bank: BankWithAccounts;
  onBankNameClick: (bankId: number) => void;
}

const BankRow: React.FC<BankRowProps> = ({ bank, onBankNameClick }) => {
  const [expanded, setExpanded] = useState(false);
  const hasAccounts = bank.accounts.length > 0;

  const handleExpand = () => {
    if (hasAccounts) {
      setExpanded(!expanded);
    }
  };

  const handleBankClick = () => {
    onBankNameClick(bank.id);
  };

  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          bgcolor: '#f5f5f5'
        }}
      >
        <Typography
          variant="subtitle1"
          component="div"
          onClick={handleBankClick}
          sx={{
            fontWeight: 'medium',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          {bank.name}
        </Typography>
        <IconButton
          onClick={handleExpand}
          disabled={!hasAccounts}
          size="small"
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <List dense disablePadding>
          {bank.accounts.map((account) => (
            <ListItem key={account.id} divider>
              <ListItemText
                primary={account.name}
                secondary={`${account.amount.toLocaleString()} ${account.currency}`}
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Box>
  );
};

export default BankRow;
