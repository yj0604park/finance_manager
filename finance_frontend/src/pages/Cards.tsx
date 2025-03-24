import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { CreditCard as CardIcon, Add as AddIcon } from '@mui/icons-material';

const Cards: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // 샘플 카드 데이터 (API 연동 전까지 사용)
  const cards = [
    {
      id: '1',
      name: '신한 S20 체크카드',
      type: '체크',
      number: '1234-5678-9012-3456',
      expiryDate: '12/25',
      bank: '신한은행'
    },
    {
      id: '2',
      name: '국민 K-체크카드',
      type: '체크',
      number: '5678-1234-3456-9012',
      expiryDate: '09/24',
      bank: '국민은행'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          카드 관리
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2 }}
        >
          새 카드 추가
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : cards.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          등록된 카드가 없습니다. 새 카드를 추가해 보세요.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {cards.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.id}>
              <Card
                sx={{
                  borderRadius: 2,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CardIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="div">
                      {card.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    카드 번호: {card.number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    유효기간: {card.expiryDate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    카드 종류: {card.type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    발급 은행: {card.bank}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button size="small" color="primary">
                      상세 정보
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Cards;
