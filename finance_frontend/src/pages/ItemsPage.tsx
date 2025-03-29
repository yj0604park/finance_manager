import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MonetizationOn as PriceIcon,
} from '@mui/icons-material';
import { useItemsQuery, useCreateItemMutation, useUpdateItemMutation, useDeleteItemMutation } from '../hooks/query/useItemsQuery';
import { CreateItemDto, UpdateItemDto, Item } from '../api/models/Item';
import ItemPricesDialog from '../components/items/ItemPricesDialog';

const ItemsPage: React.FC = () => {
  // 상태 관리
  const [openForm, setOpenForm] = useState(false);
  const [openPrices, setOpenPrices] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateItemDto>({
    name: '',
    description: '',
    category: '',
    purchase_date: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  // 쿼리 및 뮤테이션 훅 사용
  const { data: items, isLoading } = useItemsQuery();
  const createItemMutation = useCreateItemMutation();
  const updateItemMutation = useUpdateItemMutation();
  const deleteItemMutation = useDeleteItemMutation();

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      purchase_date: '',
    });
    setSelectedItemId(null);
  };

  // 폼 열기
  const handleOpenForm = (item?: Item) => {
    if (item) {
      setSelectedItemId(item.id);
      setFormData({
        name: item.name || '',
        description: item.description || '',
        category: item.category || '',
        purchase_date: item.purchase_date || '',
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

  // 가격 다이얼로그 열기
  const handleOpenPrices = (itemId: number) => {
    setSelectedItemId(itemId);
    setOpenPrices(true);
  };

  // 가격 다이얼로그 닫기
  const handleClosePrices = () => {
    setOpenPrices(false);
    setSelectedItemId(null);
  };

  // 입력 필드 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 아이템 저장 (생성 또는 수정)
  const handleSaveItem = async () => {
    try {
      if (selectedItemId) {
        // 수정
        await updateItemMutation.mutateAsync({
          id: selectedItemId,
          data: formData as UpdateItemDto,
        });
        setSnackbar({
          open: true,
          message: '아이템이 성공적으로 수정되었습니다.',
          severity: 'success',
        });
      } else {
        // 생성
        await createItemMutation.mutateAsync(formData);
        setSnackbar({
          open: true,
          message: '아이템이 성공적으로 생성되었습니다.',
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
      console.error('Item save error:', error);
    }
  };

  // 아이템 삭제
  const handleDeleteItem = async (id: number) => {
    if (window.confirm('정말로 이 아이템을 삭제하시겠습니까?')) {
      try {
        await deleteItemMutation.mutateAsync(id);
        setSnackbar({
          open: true,
          message: '아이템이 성공적으로 삭제되었습니다.',
          severity: 'success',
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: '삭제 중 오류가 발생했습니다.',
          severity: 'error',
        });
        console.error('Item delete error:', error);
      }
    }
  };

  // 스낵바 닫기
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          아이템 관리
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          아이템 추가
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {items?.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography>등록된 아이템이 없습니다. 아이템을 추가해 보세요.</Typography>
              </Paper>
            </Grid>
          ) : (
            items?.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {item.name}
                    </Typography>
                    {item.category && (
                      <Typography color="text.secondary" gutterBottom>
                        카테고리: {item.category}
                      </Typography>
                    )}
                    {item.description && (
                      <Typography variant="body2">{item.description}</Typography>
                    )}
                    {item.purchase_date && (
                      <Typography variant="body2" color="text.secondary">
                        구매일: {new Date(item.purchase_date).toLocaleDateString()}
                      </Typography>
                    )}
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenPrices(item.id)}
                    >
                      <PriceIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenForm(item)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* 아이템 폼 다이얼로그 */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedItemId ? '아이템 수정' : '아이템 추가'}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="아이템명"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="category"
              label="카테고리"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="description"
              label="설명"
              name="description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="purchase_date"
              label="구매일"
              name="purchase_date"
              type="date"
              value={formData.purchase_date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>취소</Button>
          <Button
            onClick={handleSaveItem}
            variant="contained"
            disabled={!formData.name.trim()}
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>

      {/* 아이템 가격 다이얼로그 */}
      {selectedItemId && (
        <ItemPricesDialog
          open={openPrices}
          onClose={handleClosePrices}
          itemId={selectedItemId}
          itemName={items?.find((item) => item.id === selectedItemId)?.name || ''}
        />
      )}

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
    </Container>
  );
};

export default ItemsPage;
