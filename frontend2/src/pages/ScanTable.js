import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  TextField,
  Paper
} from '@mui/material';

function ScanTable() {
  const [tableNumber, setTableNumber] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  
  useEffect(() => {
    let scanner = null;
    if (showScanner) {
      scanner = new Html5QrcodeScanner('qr-reader', {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      });
      
      scanner.render(handleScanSuccess, handleScanError);
    }
    
    return () => {
      if (scanner) {
        scanner.clear().catch(error => {
          console.error('Failed to clear scanner', error);
        });
      }
    };
  }, [showScanner]);

  const handleScanSuccess = (decodedText) => {
    const tableId = decodedText.split('/table/')[1]?.split('/menu')[0];
    if (tableId) {
      const isMobile = window.innerWidth <= 768;
      window.location.href = `/table/${tableId}/${isMobile ? 'menu-mobile' : 'menu'}`;
    }
    setShowScanner(false);
  };

  const handleScanError = (error) => {
    console.warn('Lỗi khi quét mã QR:', error);
  };

  const handleManualEntry = () => {
    if (tableNumber) {
      window.location.href = `/table/${tableNumber}/menu`;
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Quét mã QR bàn
        </Typography>

        {!showScanner ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={() => setShowScanner(true)}
              fullWidth
            >
              Mở máy quét QR
            </Button>
            
            <Typography align="center" sx={{ my: 2 }}>
              Hoặc
            </Typography>
            
            <TextField
              fullWidth
              label="Nhập số bàn"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              type="number"
              sx={{ mb: 2 }}
            />
            
            <Button 
              variant="outlined"
              onClick={handleManualEntry}
              fullWidth
            >
              Xác nhận
            </Button>
          </Box>
        ) : (
          <Box>
            {/* Đây là phần tử chứa máy quét QR */}
            <div id="qr-reader"></div>
            
            <Button 
              variant="outlined" 
              onClick={() => setShowScanner(false)}
              fullWidth
              sx={{ mt: 2 }}
            >
              Hủy
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default ScanTable; 