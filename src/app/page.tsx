'use client';
import React, { useState, useCallback } from 'react';
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

const MAX_FILES = 5;

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(500),
  age: z.enum(['puppy', 'young', 'adult', 'senior']),
  type: z.enum(['dog', 'cat', 'other']),
  size: z.enum(['small', 'medium', 'big']),
  photos: z.array(z.string()).optional(),
  genre: z.enum(['male', 'female', 'unknown']).default('unknown')
});

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      age: undefined,
      type: undefined,
      size: undefined,
      photos: [],
      genre: 'unknown'
    },
    mode: 'onChange'
  });

  const uploadToCloudinary = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/cloudinary', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    return { url: data.url };
  }, []);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      setIsLoading(true);

      try {
        const { name, description, age, type, size, genre } = values;

        const photoUrls = await Promise.all(
          selectedFiles.map((file) => uploadToCloudinary(file))
        );

        const adoptionData: TursoData = {
          name,
          description,
          age,
          type,
          size,
          genre,
          photos: photoUrls.map((data) => data.url)
        };

        const response = await fetch('/api/adoption', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(adoptionData)
        });

        const result = await response.json();

        if (response.ok) {
          // eslint-disable-next-line no-console
          console.log('Adoption inserted successfully:', result);
          form.reset();
          setSelectedFiles([]);
          setShowConfirmation(true);
        } else {
          // eslint-disable-next-line no-console
          console.error('Error inserting adoption:', result.error);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error inserting adoption:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [form, selectedFiles, uploadToCloudinary]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > MAX_FILES) {
        setFileError(
          `Solo se pueden subir un máximo de ${MAX_FILES} imágenes.`
        );
        setSelectedFiles([]);
      } else {
        setSelectedFiles(files);
        setFileError(null);
      }
    },
    []
  );

  const isFormValid =
    form.formState.isValid && selectedFiles.length <= MAX_FILES && !fileError;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6 max-w-2xl mx-auto py-8 px-4 bg-white shadow-md rounded-lg mt-4'
        >
          <h2 className='text-2xl font-bold text-center text-gray-800 mb-2'>
            Registro de Animal en Adopción
          </h2>
          <p className='text-gray-600 text-center mb-6'>Registra nuevos animales en el sistema para que estén disponibles para adopción</p>

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
                  Imágenes (máximo 5)
                </FormLabel>
                <FormControl>
                  <Input
                    type='file'
                    multiple
                    onChange={handleFileChange}
                    id='fileInput'
                    accept='image/*'
                    className='bg-gray-50 border border-gray-300 text-gray-800 rounded-md focus:ring-blue-500 focus:border-blue-500'
                  />
                </FormControl>
                {fileError && (
                  <p className='text-red-600 text-sm mt-1'>{fileError}</p>
                )}
                {selectedFiles.length > 0 && (
                  <p className='text-sm text-gray-600 mt-2'>
                    {selectedFiles.length} imagen(es) seleccionada(s)
                  </p>
                )}
              </FormItem>
            )}
          />

          <Button
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
            type='submit'
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? 'Enviando...' : 'Añadir'}
          </Button>

          {isLoading && (
            <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-75'>
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
