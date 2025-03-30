import { vi } from 'vitest';

// Material-UI 컴포넌트 모킹
vi.mock('@mui/material', async () => {

  return {
    Box: ({ children }: any) => <div data-testid="Box">{children}</div>,
    Container: ({ children, maxWidth }: any) => <div data-max-width={maxWidth}>{children}</div>,
    Typography: ({ children, variant }: any) => <div data-variant={variant}>{children}</div>,
    Paper: ({ children }: any) => <div data-testid="Paper">{children}</div>,
    Button: ({ children, onClick }: any) => (
      <button onClick={onClick}>{children}</button>
    ),
    TableContainer: ({ children }: any) => <div>{children}</div>,
    Table: ({ children }: any) => <table>{children}</table>,
    TableHead: ({ children }: any) => <thead>{children}</thead>,
    TableBody: ({ children }: any) => <tbody>{children}</tbody>,
    TableRow: ({ children }: any) => <tr>{children}</tr>,
    TableCell: ({ children, align }: any) => <td align={align}>{children}</td>,
    TextField: ({ label, value, onChange, name, type }: any) => (
      <input aria-label={label} value={value || ''} onChange={onChange} name={name} type={type} />
    ),
    Dialog: ({ open, children }: any) => (
      open ? <div data-testid="Dialog">{children}</div> : null
    ),
    DialogTitle: ({ children }: any) => <div>{children}</div>,
    DialogContent: ({ children }: any) => <div>{children}</div>,
    DialogActions: ({ children }: any) => <div>{children}</div>,
    Snackbar: ({ children }: any) => (
      <div data-testid="Snackbar">{children}</div>
    ),
    Alert: ({ children }: any) => (
      <div data-testid="Alert">{children}</div>
    ),
    IconButton: ({ children, onClick }: any) => (
      <button onClick={onClick}><span>{children}</span></button>
    ),
    Grid: ({ children }: any) => (
      <div data-testid="Grid">{children}</div>
    ),
    CircularProgress: () => <div data-testid="CircularProgress" />,
    InputAdornment: ({ children }: any) => <span>{children}</span>,
    FormControl: ({ children }: any) => <div>{children}</div>,
    InputLabel: ({ children, id }: any) => <label id={id}>{children}</label>,
    Select: ({ children, value, label, onChange }: any) => (
      <select aria-label={label} value={value || ''} onChange={onChange}>{children}</select>
    ),
    MenuItem: ({ children, value }: any) => <option value={value}>{children}</option>
  };
});


// 아이콘 모킹
vi.mock('@mui/icons-material', async () => {
  return {
    Add: () => 'AddIcon',
    Edit: () => 'EditIcon',
    Delete: () => 'DeleteIcon',
    FilterList: () => 'FilterIcon',
    Sort: () => 'SortIcon'
  };
});
