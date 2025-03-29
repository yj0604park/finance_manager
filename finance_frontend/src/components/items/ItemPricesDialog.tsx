import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useItemPricesByItemQuery, useCreateItemPriceMutation, useUpdateItemPriceMutation, useDeleteItemPriceMutation } from '../../hooks/query/useItemPricesQuery';
import { CreateItemPriceDto, UpdateItemPriceDto } from '../../api/models/ItemPrice';

interface ItemPricesDialogProps {
  open: boolean;
  onClose: () => void;
  itemId: number;
  itemName: string;
}

const ItemPricesDialog: React.FC<ItemPricesDialogProps> = ({
  open,
  onClose,
  itemId,
  itemName
}) => {
  // 상태 관리
  const [openForm, setOpenForm] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateItemPriceDto>({
    item: itemId,
    price: 0,
    currency: 'KRW',
    date: new Date().toISOString().split('T')[0],
    source: '',
    note: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  // 쿼리 및 뮤테이션 훅 사용
  const { data: prices, isLoading } = useItemPricesByItemQuery(itemId);
  const createPriceMutation = useCreateItemPriceMutation();
  const updatePriceMutation = useUpdateItemPriceMutation();
  const deletePriceMutation = useDeleteItemPriceMutation(itemId);

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      item: itemId,
      price: 0,
      currency: 'KRW',
      date: new Date().toISOString().split('T')[0],
      source: '',
      note: '',
    });
    setSelectedPriceId(null);
  };

  // 폼 열기
  const handleOpenForm = (price?: { id: number } & UpdateItemPriceDto) => {
    if (price) {
      setSelectedPriceId(price.id);
      setFormData({
        item: itemId,
        price: price.price || 0,
        currency: price.currency || 'KRW',
        date: price.date || new Date().toISOString().split('T')[0],
        source: price.source || '',
        note: price.note || '',
      });
    } else {
      resetForm();
    }
    setOpenForm(true);
  };

  // 폼 닫기
  const handleCloseForm = () => {
    setOpenForm(false);
    resetForm();
  };

  // 입력 필드 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
  };

  // 가격 저장 (생성 또는 수정)
  const handleSavePrice = async () => {
    try {
      if (selectedPriceId) {
        // 수정
        await updatePriceMutation.mutateAsync({
          id: selectedPriceId,
          data: {
            ...formData,
            id: selectedPriceId,
          },
        });
        setSnackbar({
          open: true,
          message: '가격이 성공적으로 수정되었습니다.',
          severity: 'success',
        });
      } else {
        // 생성
        await createPriceMutation.mutateAsync(formData);
        setSnackbar({
          open: true,
          message: '가격이 성공적으로 추가되었습니다.',
          severity: 'success',
        });
      }
      handleCloseForm();
    } catch (error) {
      setSnackbar({
        open: true,
        message: '작업 중 오류가 발생했습니다.',
        severity: 'error',
      });
      console.error('Price save error:', error);
    }
  };

  // 가격 삭제
  const handleDeletePrice = async (id: number) => {
    if (window.confirm('정말로 이 가격 정보를 삭제하시겠습니까?')) {
      try {
        await deletePriceMutation.mutateAsync(id);
        setSnackbar({
          open: true,
          message: '가격이 성공적으로 삭제되었습니다.',
          severity: 'success',
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: '삭제 중 오류가 발생했습니다.',
          severity: 'error',
        });
        console.error('Price delete error:', error);
      }
    }
  };

  // 스낵바 닫기
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // 날짜 형식 변환
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{itemName} - 가격 이력</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1">
              여러 시점의 아이템 가격을 기록하고 관리할 수 있습니다.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenForm()}
              size="small"
            >
              가격 추가
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : prices && prices.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>날짜</TableCell>
                    <TableCell align="right">가격</TableCell>
                    <TableCell>통화</TableCell>
                    <TableCell>출처</TableCell>
                    <TableCell>비고</TableCell>
                    <TableCell align="center">작업</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prices.map((price) => (
                    <TableRow key={price.id}>
                      <TableCell>{formatDate(price.date)}</TableCell>
                      <TableCell align="right">{price.price.toLocaleString()}</TableCell>
                      <TableCell>{price.currency}</TableCell>
                      <TableCell>{price.source}</TableCell>
                      <TableCell>{price.note}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenForm(price)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeletePrice(price.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography>등록된 가격 정보가 없습니다. 가격을 추가해 보세요.</Typography>
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>닫기</Button>
        </DialogActions>
      </Dialog>

      {/* 가격 폼 다이얼로그 */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedPriceId ? '가격 수정' : '가격 추가'}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="price"
              label="가격"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="currency"
              label="통화"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="date"
              label="가격 날짜"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              id="source"
              label="출처"
              name="source"
              value={formData.source}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="note"
              label="비고"
              name="note"
              multiline
              rows={3}
              value={formData.note}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>취소</Button>
          <Button
            onClick={handleSavePrice}
            variant="contained"
            disabled={!formData.price || !formData.date}
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>

      {/* 알림 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ItemPricesDialog;
