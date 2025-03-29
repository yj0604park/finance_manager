import '@testing-library/jest-dom';
import { vi } from 'vitest';

// 테스트를 위한 전역 설정
// 필요한 경우 global mock 설정

// Material UI 컴포넌트 모킹
vi.mock('@mui/material', () => {
  return {
    Typography: vi.fn(),
    Box: vi.fn(),
    Card: vi.fn(),
    CardContent: vi.fn(),
    Stack: vi.fn(),
    Button: vi.fn(),
    Snackbar: vi.fn(),
    Alert: vi.fn(),
    Dialog: vi.fn(),
    DialogTitle: vi.fn(),
    DialogContent: vi.fn(),
    DialogActions: vi.fn(),
    TextField: vi.fn(),
    FormControl: vi.fn(),
    InputLabel: vi.fn(),
    Select: vi.fn(),
    MenuItem: vi.fn(),
    FormControlLabel: vi.fn(),
    Checkbox: vi.fn(),
    Link: vi.fn(),
    Grid: vi.fn(),
    Chip: vi.fn(),
    InputAdornment: vi.fn(),
    Tooltip: vi.fn(),
    IconButton: vi.fn(),
    Table: vi.fn(),
    TableBody: vi.fn(),
    TableCell: vi.fn(),
    TableContainer: vi.fn(),
    TableHead: vi.fn(),
    TableRow: vi.fn(),
    Paper: vi.fn(),
  };
});

// Grid2 모킹
vi.mock('@mui/material/Unstable_Grid2', () => ({
  default: vi.fn(),
}));

// Material UI 아이콘 모킹
vi.mock('@mui/icons-material/ArrowBack', () => ({
  default: vi.fn(),
}));

vi.mock('@mui/icons-material/Add', () => ({
  default: vi.fn(),
}));

vi.mock('@mui/icons-material/Edit', () => ({
  default: vi.fn(),
}));

vi.mock('@mui/icons-material/Delete', () => ({
  default: vi.fn(),
}));

vi.mock('@mui/icons-material/Receipt', () => ({
  default: vi.fn(),
}));

// Date Picker 모킹
vi.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: vi.fn(),
}));

vi.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: vi.fn(),
}));

vi.mock('@mui/x-date-pickers/AdapterDateFns', () => ({
  AdapterDateFns: vi.fn(),
}));

// Apollo Client 모킹
vi.mock('@apollo/client', () => {
  return {
    ApolloProvider: vi.fn(),
    useQuery: vi.fn(),
    useMutation: vi.fn().mockReturnValue([vi.fn(), { loading: false }]),
  };
});

// API 서비스 모킹
vi.mock('./api/services/TransactionsService', () => ({
  TransactionsService: {
    transactionsList: vi.fn().mockResolvedValue([]),
    transactionsCreate: vi.fn(),
    transactionsUpdate: vi.fn(),
    transactionsDestroy: vi.fn(),
    transactionsRetrieve: vi.fn(),
  },
}));

vi.mock('./api/services/AccountsService', () => ({
  AccountsService: {
    accountsList: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock('./api/services/BanksService', () => ({
  BanksService: {
    banksList: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock('./api/services/RetailersService', () => ({
  RetailersService: {
    retailersList: vi.fn().mockResolvedValue([]),
  },
}));
