import { useState } from 'react';
import { useAlert } from '../contexts/AlertContext';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
} from '@mui/icons-material';

function Contact() {
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
   // Thêm state để kiểm tra form đã được submit chưa
   const [isSubmitted, setIsSubmitted] = useState(false);

   // Thêm state để quản lý lỗi
   const [errors, setErrors] = useState({
     name: '',
     email: '',
     phone: '',
     subject: '',
     message: '',
   });

   const validateField = (name, value) => {
     if (!value.trim()) {
       return 'Ô này không được để trống';
     }
     
     // Thêm các validation khác tùy field
     switch (name) {
       case 'email':
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if (!emailRegex.test(value)) {
           return 'Email không hợp lệ';
         }
         break;
       case 'phone':
         const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
         if (!phoneRegex.test(value)) {
           return 'Số điện thoại không hợp lệ';
         }
         break;
       default:
         break;
     }
     return '';
   };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Xóa lỗi khi user bắt đầu nhập
    if (isSubmitted) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Kiểm tra lỗi
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      newErrors[key] = validateField(key, formData[key]);
    });
    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== '')) {
      showAlert('error', 'Vui lòng kiểm tra lại thông tin!');
      return;
    }

    try {
      // Gọi API
      // await apiCall(formData);
      
      showAlert('success', 'Gửi tin nhắn thành công!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setIsSubmitted(false);
      
    } catch (error) {
      showAlert('error', 'Có lỗi xảy ra, vui lòng thử lại sau!');
    }
  };

  const contactInfo = [
    {
      icon: <PhoneIcon color="primary" />,
      title: 'Điện thoại',
      content: '1900 1234',
      subContent: 'Thứ 2 - Chủ nhật: 8:00 - 22:00',
    },
    {
      icon: <EmailIcon color="primary" />,
      title: 'Email',
      content: 'support@fastfood.com',
      subContent: 'Chúng tôi sẽ phản hồi trong vòng 24h',
    },
    {
      icon: <LocationIcon color="primary" />,
      title: 'Địa chỉ',
      content: '123 Đường ABC, Quận XYZ',
      subContent: 'Thành phố Hồ Chí Minh, Việt Nam',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Liên hệ với chúng tôi
      </Typography>
      
      {/* Thông tin liên hệ */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {contactInfo.map((info, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card elevation={3}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {info.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {info.title}
                </Typography>
                <Typography variant="body1" color="primary" gutterBottom>
                  {info.content}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {info.subContent}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Form liên hệ và bản đồ */}
      <Grid container spacing={4}>
        {/* Form liên hệ */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Gửi tin nhắn cho chúng tôi
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tiêu đề"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    error={!!errors.subject}
                    helperText={errors.subject}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nội dung"
                    name="message"
                    multiline
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    error={!!errors.message}
                    helperText={errors.message}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                  >
                    Gửi tin nhắn
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Bản đồ */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Vị trí của chúng tôi
            </Typography>
            <Box sx={{ height: '400px', bgcolor: 'grey.200', mb: 2 }}>
              {/* Thêm Google Map hoặc bản đồ khác ở đây */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197956!2d106.69765157580734!3d10.777599989318768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3a9d8d1bb3%3A0xd3108d3f3d4f4d96!2zMTIzIMSQxrDhu51uZyBBQkMsIFF14bqtbiAxLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1647007547123!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Bản đồ địa chỉ cửa hàng"
              ></iframe>
            </Box>
            
            {/* Social Media Links */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <IconButton color="primary" href="#" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary" href="#" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="primary" href="#" aria-label="YouTube">
                <YouTubeIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Contact; 