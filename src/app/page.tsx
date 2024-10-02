'use client';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { TursoData } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(500),
  age: z.enum(['puppy', 'young', 'adult', 'senior']),
  type: z.enum(['dog', 'cat', 'other']),
  size: z.enum(['small', 'medium', 'big']),
  photos: z.array(z.string()).optional(),
  genre: z.enum(['male', 'female', 'unknown']).default('unknown') // Añadir este campo
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); // Añadir este estado
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      age: undefined,
      type: undefined,
      size: undefined,
      photos: [],
      genre: 'unknown' // Añadir valor por defecto
    },
    mode: 'onChange' // Añadir esta línea
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  async function uploadToCloudinary(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/cloudinary', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    return { url: data.url };
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true); // Activar el indicador de carga

    const { name, description, age, type, size, genre } = values; // Añadir genre aquí

    // Subir las imágenes y obtener tanto la URL como el `imageId`
    const photoData = await Promise.all(
      selectedFiles.map(async (file) => {
        const { url } = await uploadToCloudinary(file);
        return { url };
      })
    );
    const photoUrls = photoData.map((data) => data.url);
    const adoptionData: TursoData = {
      name,
      description,
      age,
      type,
      size,
      genre, // Añadir genre aquí
      photos: photoUrls.length ? photoUrls : []
    };

    try {
      const response = await fetch('/api/adoption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adoptionData)
      });

      const result = await response.json();

      if (response.ok) {
        // eslint-disable-next-line
        console.log('Adoption inserted successfully:', result);

        form.reset({
          name: '',
          description: '',
          age: undefined,
          type: undefined,
          size: undefined,
          photos: [],
          genre: 'unknown' // Añadir valor por defecto
        });
        setSelectedFiles([]);
        setShowConfirmation(true); // Mostrar la ventana de confirmación
      } else {
        // eslint-disable-next-line
        console.error('Error inserting adoption:', result.error);
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error('Error inserting adoption:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const isFormValid = form.formState.isValid; // Añadir esta línea

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6 max-w-2xl mx-auto py-8 px-4 bg-white shadow-md rounded-lg'
        >
          <h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>
            Registro de Animal en Adopción
          </h2>

          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-gray-700 font-medium'>
                  Nombre
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Introduce un nombre ...'
                    {...field}
                    className='bg-gray-50 border border-gray-300 text-gray-800 rounded-md focus:ring-blue-500 focus:border-blue-500'
                  />
                </FormControl>
                <FormMessage className='text-red-600' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-gray-700 font-medium'>
                  Descripción
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Cuenta su historia ...'
                    {...field}
                    className='bg-gray-50 border border-gray-300 text-gray-800 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-[150px]'
                  />
                </FormControl>
                <FormMessage className='text-red-600' />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='age'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700 font-medium'>
                    Edad
                  </FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className='bg-gray-50 border border-gray-300 text-gray-800 rounded-md focus:ring-blue-500 focus:border-blue-500'>
                        <SelectValue placeholder='Selecciona una edad' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='puppy'>Cachorro</SelectItem>
                      <SelectItem value='young'>Adulto joven</SelectItem>
                      <SelectItem value='adult'>Adulto</SelectItem>
                      <SelectItem value='senior'>Anciano</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-red-600' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700 font-medium'>
                    Tipo
                  </FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className='bg-gray-50 border border-gray-300 text-gray-800 rounded-md focus:ring-blue-500 focus:border-blue-500'>
                        <SelectValue placeholder='Elige un animal' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='dog'>Perro</SelectItem>
                      <SelectItem value='cat'>Gato</SelectItem>
                      <SelectItem value='other'>Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-red-600' />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='size'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700 font-medium'>
                    Tamaño
                  </FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className='bg-gray-50 border border-gray-300 text-gray-800 rounded-md focus:ring-blue-500 focus:border-blue-500'>
                        <SelectValue placeholder='Selecciona un tamaño' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='small'>Pequeño</SelectItem>
                      <SelectItem value='medium'>Mediano</SelectItem>
                      <SelectItem value='big'>Grande</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-red-600' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='genre'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700 font-medium'>
                    Género
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='bg-gray-50 border border-gray-300 text-gray-800 rounded-md focus:ring-blue-500 focus:border-blue-500'>
                        <SelectValue placeholder='Selecciona un género' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='unknown'>Desconocido</SelectItem>
                      <SelectItem value='male'>Macho</SelectItem>
                      <SelectItem value='female'>Hembra</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-red-600' />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='photos'
            render={() => (
              <FormItem>
                <FormLabel className='text-gray-700 font-medium'>
                  Imágenes
                </FormLabel>
                <FormControl>
                  <Input
                    type='file'
                    multiple
                    onChange={handleFileChange}
                    id='fileInput'
                    className='bg-gray-50 border border-gray-300 text-gray-800 rounded-md focus:ring-blue-500 focus:border-blue-500'
                  />
                </FormControl>
                <FormMessage className='text-red-600' />
              </FormItem>
            )}
          />

          <Button
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
            type='submit'
            disabled={isLoading || !isFormValid} // Modificar esta línea
          >
            {isLoading ? 'Enviando...' : 'Añadir'}
          </Button>

          {isLoading && (
            <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-75'>
              {/* Aquí puedes añadir un componente de spinner o loader */}
              <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500'></div>
            </div>
          )}
        </form>
      </Form>

      {showConfirmation && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white p-8 rounded-lg shadow-lg text-center'>
            <h3 className='text-xl font-bold mb-4'>¡Registro exitoso!</h3>
            <p className='mb-4'>
              El animal ha sido registrado correctamente para adopción.
            </p>
            <div className='flex justify-center'>
              <Button
                onClick={() => {
                  setShowConfirmation(false);
                  window.location.reload();
                }}
                className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
