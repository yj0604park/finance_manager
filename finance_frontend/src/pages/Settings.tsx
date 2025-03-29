import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  TextField,
  Card,
  CardContent,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const handleSave = () => {
    // 설정 저장 로직
    console.log('설정 저장됨', { notifications, darkMode, email });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        설정
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                일반 설정
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications}
                      onChange={() => setNotifications(!notifications)}
                    />
                  }
                  label="알림 활성화"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
                  label="다크 모드"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                계정 설정
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="이메일 알림 주소"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  helperText="알림을 받을 이메일 주소를 입력하세요"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
          설정 저장
        </Button>
      </Box>
    </Container>
  );
};

export default Settings;
