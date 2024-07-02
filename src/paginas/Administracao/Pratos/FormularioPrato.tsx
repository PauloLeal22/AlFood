import { Box, Button, Container, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import http from "../../../http";
import ITag from "../../../interfaces/ITag";
import IRestaurante from "../../../interfaces/IRestaurante";
import { useParams } from "react-router-dom";
import IPrato from "../../../interfaces/IPrato";

const FormularioPrato = () => {

    const parametros = useParams();
    
    const [nomePrato, setNomePrato] = useState('');
    const [descricao, setDescricao] = useState('');
    const [tag, setTag] = useState('');
    const [tags, setTags] = useState<ITag[]>([]);
    const [restaurante, setRestaurante] = useState('');
    const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
    const [imagem, setimagem] = useState<File | null>(null);

    useEffect(() => {
        http.get< { tags: ITag[] } >('tags/')
        .then(response => setTags(response.data.tags))
        .catch(error => console.log(error));

        http.get<IRestaurante[]>('restaurantes/')
        .then(response => setRestaurantes(response.data))
        .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        if (parametros.id) {
            http.get< IPrato >(`pratos/${parametros.id}/`)
            .then(response => {
                setNomePrato(response.data.nome);
                setDescricao(response.data.descricao);
                setRestaurante(response.data.restaurante.toString());
                setTag(response.data.tag);
            })
            .catch(error => console.log(error));
        }
    }, [parametros])

    const selecionarArquivo = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            setimagem(event.target.files[0]);
        } else {
            setimagem(null);
        }
    }

    const aoSubmeterForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
   
        const formData = new FormData();
        formData.append('nome', nomePrato);
        formData.append('descricao', descricao);
        formData.append('tag', tag);
        formData.append('restaurante', restaurante);

        if (imagem) {
            formData.append('imagem', imagem);
        }

        http.request({
            url: parametros.id ? `pratos/${parametros.id}/` : 'pratos/',
            method: parametros.id ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        })
        .then(() => {
            if(!parametros.id) {
                setNomePrato('');
                setDescricao('');
                setRestaurante('');
                setTag('');
                setimagem(null);
            }

            alert('Prato salvo com sucesso.');
        })
        .catch(error => console.log(error));
    }

    return (
        <>
            <Box>
                <Container maxWidth="lg" sx={{ mt: 1 }}>
                    <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
                            <Typography component='h1' variant='h6'>Formulário de Pratos</Typography>
                            <Box component='form' sx={{ width: '100%' }} onSubmit={aoSubmeterForm}>
                                <TextField 
                                    value={nomePrato} 
                                    onChange={event => setNomePrato(event.target.value)} 
                                    label='Nome do Prato' 
                                    variant='standard' 
                                    fullWidth
                                    required
                                    margin="dense"
                                />

                                <TextField 
                                    value={descricao} 
                                    onChange={event => setDescricao(event.target.value)} 
                                    label='Descricao' 
                                    variant='standard' 
                                    fullWidth
                                    required
                                    margin="dense"
                                />

                                <FormControl variant="standard" margin="dense" fullWidth>
                                    <InputLabel id="selectTag">
                                        Tag
                                    </InputLabel>
                                    <Select labelId="selectTag" value={tag} onChange={event => setTag(event.target.value)}>
                                        {
                                            tags.map(tag => 
                                                <MenuItem key={tag.id} value={tag.value}>
                                                    { tag.value }
                                                </MenuItem>
                                            )
                                        }
                                    </Select>
                                </FormControl>

                                <FormControl variant="standard" margin="dense" fullWidth>
                                    <InputLabel id="selectRestaurante">
                                        Restaurante
                                    </InputLabel>
                                    <Select labelId="selectRestaurante" value={restaurante} onChange={event => setRestaurante(event.target.value)}>
                                        {
                                            restaurantes.map(restaurante => 
                                                <MenuItem key={restaurante.id} value={restaurante.id}>
                                                    { restaurante.nome }
                                                </MenuItem>
                                            )
                                        }
                                    </Select>
                                </FormControl>

                                <input type="file" onChange={event => selecionarArquivo(event)}/>

                                <Button sx={{ marginTop: 1 }} type='submit' variant='outlined' fullWidth>SALVAR</Button>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </>
    )
}

export default FormularioPrato;