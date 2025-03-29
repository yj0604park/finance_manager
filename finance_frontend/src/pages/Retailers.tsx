import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { RetailersService } from '../api/services/RetailersService';
import { Retailer } from '../api/models/Retailer';
import { RetailerTypeEnum } from '../api/models/RetailerTypeEnum';
import { CategoryEnum } from '../api/models/CategoryEnum';

const Retailers: React.FC = () => {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [currentRetailer, setCurrentRetailer] = useState<Retailer | null>(null);
  const [retailerInput, setRetailerInput] = useState<{
    name: string;
    retailer_type: RetailerTypeEnum;
    category: CategoryEnum;
  }>({
    name: '',
    retailer_type: RetailerTypeEnum.STORE,
    category: CategoryEnum.UNKNOWN,
  });

  // 판매처 목록 불러오기
  const fetchRetailers = async () => {
    try {
      setLoading(true);
      const data = await RetailersService.retailersList();
      setRetailers(data);
    } catch (error) {
      console.error('판매처 목록을 불러오는 데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRetailers();
  }, []);

  // 판매처 추가/수정 다이얼로그 열기
  const handleOpenDialog = (retailer?: Retailer) => {
    if (retailer) {
      setCurrentRetailer(retailer);
      setRetailerInput({
        name: retailer.name,
        retailer_type: retailer.retailer_type || RetailerTypeEnum.STORE,
        category: retailer.category || CategoryEnum.UNKNOWN,
      });
    } else {
      setCurrentRetailer(null);
      setRetailerInput({
        name: '',
        retailer_type: RetailerTypeEnum.STORE,
        category: CategoryEnum.UNKNOWN,
      });
    }
    setOpenDialog(true);
  };

  // 판매처 추가/수정 다이얼로그 닫기
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // 판매처 삭제 다이얼로그 열기
  const handleOpenDeleteDialog = (retailer: Retailer) => {
    setCurrentRetailer(retailer);
    setOpenDeleteDialog(true);
  };

  // 판매처 삭제 다이얼로그 닫기
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // 판매처 추가
  const handleAddRetailer = async () => {
    try {
      if (!retailerInput.name.trim()) {
        alert('판매처 이름을 입력해주세요.');
        return;
      }

      await RetailersService.retailersCreate({
        id: 0, // 서버에서 할당될 ID
        name: retailerInput.name,
        retailer_type: retailerInput.retailer_type,
        category: retailerInput.category,
        user: 0, // 서버에서 현재 사용자로 자동 할당됨
      } as Retailer);

      handleCloseDialog();
      fetchRetailers();
    } catch (error) {
      console.error('판매처 추가에 실패했습니다:', error);
    }
  };

  // 판매처 수정
  const handleUpdateRetailer = async () => {
    try {
      if (!currentRetailer) return;
      if (!retailerInput.name.trim()) {
        alert('판매처 이름을 입력해주세요.');
        return;
      }

      await RetailersService.retailersUpdate(currentRetailer.id, {
        ...currentRetailer,
        name: retailerInput.name,
        retailer_type: retailerInput.retailer_type,
        category: retailerInput.category,
      });

      handleCloseDialog();
      fetchRetailers();
    } catch (error) {
      console.error('판매처 수정에 실패했습니다:', error);
    }
  };

  // 판매처 삭제
  const handleDeleteRetailer = async () => {
    try {
      if (!currentRetailer) return;

      await RetailersService.retailersDestroy(currentRetailer.id);

      handleCloseDeleteDialog();
      fetchRetailers();
    } catch (error) {
      console.error('판매처 삭제에 실패했습니다:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" component="h1">
              판매처 관리
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              판매처 추가
            </Button>
          </Box>

          <Paper elevation={3}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>이름</TableCell>
                    <TableCell>판매처 유형</TableCell>
                    <TableCell>카테고리</TableCell>
                    <TableCell align="right">작업</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        로딩 중...
                      </TableCell>
                    </TableRow>
                  ) : retailers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        등록된 판매처가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    retailers.map((retailer) => (
                      <TableRow key={retailer.id}>
                        <TableCell>{retailer.id}</TableCell>
                        <TableCell>{retailer.name}</TableCell>
                        <TableCell>{retailer.retailer_type}</TableCell>
                        <TableCell>{retailer.category}</TableCell>
                        <TableCell align="right">
                          <IconButton color="primary" onClick={() => handleOpenDialog(retailer)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDeleteDialog(retailer)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* 판매처 추가/수정 다이얼로그 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{currentRetailer ? '판매처 수정' : '판매처 추가'}</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <TextField
              label="판매처 이름"
              fullWidth
              value={retailerInput.name}
              onChange={(e) => setRetailerInput({ ...retailerInput, name: e.target.value })}
              margin="normal"
              required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="retailer-type-label">판매처 유형</InputLabel>
              <Select
                labelId="retailer-type-label"
                value={retailerInput.retailer_type}
                label="판매처 유형"
                onChange={(e) =>
                  setRetailerInput({
                    ...retailerInput,
                    retailer_type: e.target.value as RetailerTypeEnum,
                  })
                }
              >
                {Object.values(RetailerTypeEnum).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type === RetailerTypeEnum.STORE && '상점'}
                    {type === RetailerTypeEnum.PERSON && '개인'}
                    {type === RetailerTypeEnum.BANK && '은행'}
                    {type === RetailerTypeEnum.SERVICE && '서비스'}
                    {type === RetailerTypeEnum.INCOME && '수입'}
                    {type === RetailerTypeEnum.RESTAURANT && '식당'}
                    {type === RetailerTypeEnum.INTERNET && '인터넷'}
                    {type === RetailerTypeEnum.ETC && '기타'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">카테고리</InputLabel>
              <Select
                labelId="category-label"
                value={retailerInput.category}
                label="카테고리"
                onChange={(e) =>
                  setRetailerInput({ ...retailerInput, category: e.target.value as CategoryEnum })
                }
              >
                {Object.values(CategoryEnum).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button
            onClick={currentRetailer ? handleUpdateRetailer : handleAddRetailer}
            variant="contained"
            color="primary"
          >
            {currentRetailer ? '수정' : '추가'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 판매처 삭제 확인 다이얼로그 */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>판매처 삭제</DialogTitle>
        <DialogContent>
          <Typography>'{currentRetailer?.name}' 판매처를 삭제하시겠습니까?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>취소</Button>
          <Button onClick={handleDeleteRetailer} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Retailers;
