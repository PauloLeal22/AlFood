import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IRestaurante from "../../../interfaces/IRestaurante";
import http from "../../../http";

const FormularioRestaurante = () => {

    const parametros = useParams();

    useEffect(() => {
        if(parametros.id) {
            http.get<IRestaurante>(`restaurantes/${parametros.id}/`)
            .then(response => {
                setNomeRestaurante(response.data.nome);
            })
            .catch(error => {
                console.log(error);
            });
        }
    }, [parametros]);

    const [nomeRestaurante, setNomeRestaurante] = useState('');

    const aoSubmeterForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(parametros.id) {
            http.put(
                `restaurantes/${parametros.id}/`, 
                {
                    nome: nomeRestaurante
                }
            )
            .then(response => {
                alert('Restaurante atualizado com sucesso!');
            })
            .catch(error => {
                console.log(error);
            });
        } else {
            http.post(
                'restaurantes/', 
                {
                    nome: nomeRestaurante
                }
            )
            .then(response => {
                alert('Restaurante cadastrado com sucesso!');
            })
            .catch(error => {
                console.log(error);
            });
        }       
    }

    return (
        <>
            <Box>
                <Container maxWidth="lg" sx={{ mt: 1 }}>
                    <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
                            <Typography component='h1' variant='h6'>Formulário de Restaurantes</Typography>
                            <Box component='form' sx={{ width: '100%' }} onSubmit={aoSubmeterForm}>
                                <TextField 
                                    value={nomeRestaurante} 
                                    onChange={event => setNomeRestaurante(event.target.value)} 
                                    label='Nome do Restaurante' 
                                    variant='standard' 
                                    fullWidth
                                    required
                                />
                                <Button sx={{ marginTop: 1 }} type='submit' variant='outlined' fullWidth>SALVAR</Button>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </>
    )
}

export default FormularioRestaurante;