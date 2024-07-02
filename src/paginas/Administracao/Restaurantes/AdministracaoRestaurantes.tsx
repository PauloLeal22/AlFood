import { useEffect, useState } from "react";
import IRestaurante from "../../../interfaces/IRestaurante";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Link } from "react-router-dom";
import http from "../../../http";

const AdministracaoRestaurantes = () => {
    const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);

    useEffect(() => {
        http.get<IRestaurante[]>('restaurantes/')
            .then(response => {
                setRestaurantes(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const excluir = (restauranteAExcluir: IRestaurante) => {
        http.delete(`restaurantes/${restauranteAExcluir.id}/`)
        .then(response => {
            alert('Restaurante excluído.');

            const listaRestaurantes = restaurantes.filter(restaurante => restaurante.id !== restauranteAExcluir.id);

            setRestaurantes([...listaRestaurantes]);
        })
        .catch(error => {
            console.log(error);
        })
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Nome
                        </TableCell>
                        <TableCell>
                            Editar
                        </TableCell>
                        <TableCell>
                            Excluir
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        restaurantes.map(restaurante =>
                            <TableRow key={restaurante.id}>
                                <TableCell>
                                    { restaurante.nome }
                                </TableCell>
                                <TableCell>
                                    [ <Link to={`/admin/restaurantes/${restaurante.id}`}>Editar</Link> ]
                                </TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="error" onClick={() => excluir(restaurante)}>
                                        Excluir
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default AdministracaoRestaurantes;