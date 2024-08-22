import React from 'react';
import { useParams } from 'react-router-dom';
import { WsClient } from './utils/websocket';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Coffee from '@mui/icons-material/Coffee';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import { Typography } from '@mui/material';

const cardValues = [0, 1, 2, 3, 5, 8, null]

const ActiveSession = () => {
  const { id } = useParams();

  const [game, setGame] = React.useState<{client: WsClient, id: string} | null>(null);
  React.useEffect(() => {
    if (id) {
      setGame(() => ({
        id: id as string,
        client: new WsClient()
      }))
    }
    return () => {
      game?.client.close();
    }
  }, [id])

  React.useEffect(() => {
    game?.client.receiveData((event) => {console.log(event);}, id as string)
  }, [game?.id])

  return <Container maxWidth={false} sx={{ mt: 2, mb: 4 }}>
    <Grid container spacing={3}>
      {/* Chart */}
      <Grid item xs={12} md={8} lg={12}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: '70vh',
            spacing: 0,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Card variant="outlined" sx={{
            minWidth: '20rem',
            minHeight: '10rem',
            textAlign: 'center',
            alignContent: 'center',
            backgroundColor: '#03DAC6',
            borderRadius: 10
          }}>
            <CardContent
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 'auto',
              }}
            >
              Start by picking your cards!
            </CardContent>
        </Card>
        <Card variant="outlined"  sx={{
            minWidth: '1rem',
            height: '4rem',
            textAlign: 'center',
            alignContent: 'center',
            backgroundColor: '#f5f5f5',
            mt: 2, mb: 4
          }}>
          <CardContent></CardContent>
        </Card>
        <Typography>
          Here will be name
        </Typography>
        </Paper>
      </Grid>
    </Grid>
    <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
      <Grid container spacing={3}>
        {cardValues.map((item, key) => <Grid key={key} item lg={12 / (cardValues.length + 1)}>
          <Card sx={{
              transition: "transform 0.15s ease-in-out",
              "&:hover": { transform: "scale3d(1.3, 1.3, 1)", border: '1px solid #03a9f4' },
              width: '3rem'
            }}>
            <CardActionArea>
              <CardContent
                sx={{
                  p: 2,
                  paddingLeft: 0,
                  paddingRight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'auto',
                  fontSize: 40,
                  textAlign: 'center'
                }}
              >
                {item ?? '?'}
              </CardContent>
            </CardActionArea>
          </Card>
          {/* <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 'auto',
              fontSize: 30,
              textAlign: 'center'
            }}
          >
            {item ?? '?'}
          </Paper> */}
        </Grid>)}
        <Grid item lg={12 / (cardValues.length + 1)}>
        <Card sx={{
            transition: "transform 0.15s ease-in-out",
            "&:hover": { transform: "scale3d(1.3, 1.3, 1)", border: '1px solid #03a9f4' },
          }}>
          <CardActionArea>
            <CardContent
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 'auto',
              }}
            >
              <Coffee sx={{ fontSize: 45 }}/>
            </CardContent>
          </CardActionArea>
        </Card>
        </Grid>
      </Grid>
    </Container>
  </Container>
}

export default ActiveSession;
