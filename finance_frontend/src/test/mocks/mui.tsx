import { vi } from 'vitest';

/**
 * Material UI 컴포넌트 모킹
 *
 * 테스트에서 사용할 Material UI 컴포넌트를 모킹합니다.
 * 필요한 컴포넌트를 추가하여 사용할 수 있습니다.
 */
export const setupMaterialUIMocks = () => {
  vi.mock('@mui/material', () => {
    return {
      Typography: ({ variant, children }: { variant?: string; children: React.ReactNode }) =>
        <div data-variant={variant}>{children}</div>,
      Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      Stack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      Button: ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) =>
        <button onClick={onClick}>{children}</button>,
      Snackbar: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => {
        if (props['aria-label']) {
          return <div role="button" aria-label={props['aria-label']}>{children}</div>;
        }
        return <div data-testid="Snackbar">{children}</div>;
      },
      Alert: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => {
        if (props['aria-label']) {
          return <div role="button" aria-label={props['aria-label']}>{children}</div>;
        }
        return <div data-testid="Alert">{children}</div>;
      },
      Dialog: ({ open, children }: { open?: boolean; children: React.ReactNode }) =>
        open ? <div>{children}</div> : null,
      DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      DialogActions: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      TextField: ({ label, placeholder, value, onChange, InputProps }: {
        label?: string;
        placeholder?: string;
        value?: string;
        onChange?: (e: any) => void;
        InputProps?: any;
      }) => (
        <input
          placeholder={placeholder}
          aria-label={label}
          value={value || ''}
          onChange={onChange}
        />
      ),
      FormControl: ({ fullWidth, children, label }: {
        fullWidth?: boolean;
        children: React.ReactNode;
        label?: string;
      }) => {
        if (label) {
          return <div role="form" aria-label={label}>{children}</div>;
        }
        return <div>{children}</div>;
      },
      InputLabel: ({ id, children }: { id: string; children: React.ReactNode }) =>
        <label id={id}>{children}</label>,
      Select: ({ labelId, value, label, onChange, children }: {
        labelId?: string;
        value?: any;
        label?: string;
        onChange?: (e: any) => void;
        children: React.ReactNode
      }) => (
        <select aria-label={label} value={value || ''} onChange={onChange}>
          {children}
        </select>
      ),
      MenuItem: ({ value, children }: { value: any; children: React.ReactNode }) =>
        <option value={value}>{children}</option>,
      Grid: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => {
        if (props['aria-label']) {
          return <div role="button" aria-label={props['aria-label']}>{children}</div>;
        }
        return <div data-testid="Grid">{children}</div>;
      },
      IconButton: ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) =>
        <button onClick={onClick}>{children}</button>,
      Table: ({ children }: { children: React.ReactNode }) => <table>{children}</table>,
      TableBody: ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>,
      TableCell: ({ align, children }: {
        align?: 'left' | 'center' | 'right' | 'justify' | 'char';
        children: React.ReactNode
      }) => <td align={align}>{children}</td>,
      TableContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      TableHead: ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>,
      TableRow: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,
      Paper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      Container: ({ children, maxWidth }: { children: React.ReactNode; maxWidth?: string }) =>
        <div data-max-width={maxWidth}>{children}</div>,
      InputAdornment: ({ position, children }: { position?: string; children: React.ReactNode }) =>
        <div data-position={position}>{children}</div>,
      TablePagination: ({
        component,
        count,
        page,
        onPageChange,
        rowsPerPage,
        onRowsPerPageChange,
        rowsPerPageOptions
      }: {
        component: any;
        count: number;
        page: number;
        onPageChange: (event: any, page: number) => void;
        rowsPerPage: number;
        onRowsPerPageChange: (event: any) => void;
        rowsPerPageOptions: number[];
      }) => (
        <div data-testid="TablePagination">
          <span>페이지: {page + 1}</span>
          <select onChange={(e) => onRowsPerPageChange(e)}>
            {rowsPerPageOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      ),
      Chip: ({ label, color }: { label: string; color?: string }) =>
        <span data-color={color}>{label}</span>,
      Tooltip: ({ title, children }: { title: string; children: React.ReactNode }) =>
        <div title={title}>{children}</div>,
    };
  });

  // Grid2 모킹 - 필요한 경우에만 사용
  vi.mock('@mui/material/Grid2', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
  }));
};

/**
 * Material UI 아이콘 모킹
 *
 * 테스트에서 사용할 Material UI 아이콘을 모킹합니다.
 */
export const setupMuiIconsMocks = () => {
  vi.mock('@mui/icons-material/Add', () => ({
    default: () => <span>+</span>,
  }));

  vi.mock('@mui/icons-material/Edit', () => ({
    default: () => <span>✎</span>,
  }));

  vi.mock('@mui/icons-material/Delete', () => ({
    default: () => <span>🗑</span>,
  }));

  vi.mock('@mui/icons-material/Search', () => ({
    default: () => <span>🔍</span>,
  }));

  vi.mock('@mui/icons-material/Receipt', () => ({
    default: () => <span>🧾</span>,
  }));

  vi.mock('@mui/icons-material/ArrowBack', () => ({
    default: () => <span>←</span>,
  }));
};
